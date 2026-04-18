
import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';

interface CallingUIProps {
  isOpen: boolean;
  onClose: () => void;
  contactName: string;
  contactAvatar: string;
}

// Manual encoding following guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Manual decoding following guidelines
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Standard raw PCM audio decoding following guidelines
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const CallingUI: React.FC<CallingUIProps> = ({ isOpen, onClose, contactName, contactAvatar }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  useEffect(() => {
    let interval: any;
    if (isConnected) {
      interval = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = async () => {
    setErrorMessage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }).catch(err => {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDismissedError') {
          throw new Error("Microphone permission denied. Allow access to sync.");
        }
        throw err;
      });

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      inputAudioContextRef.current = inputCtx;
      outputAudioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: `You are ${contactName}, a world-class senior developer on the CODQIT platform. Help the user manifest their architectures, review code structures, and climb the Global Grid. Be technical, elite, and encouraging.`
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            const source = inputCtx.createMediaStreamSource(stream);
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            processor.onaudioprocess = (e) => {
              const input = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(input.length);
              for (let i = 0; i < input.length; i++) int16[i] = input[i] * 32768;
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              // Ensure data is sent only after session resolves to prevent race conditions
              sessionPromise.then(s => {
                if (s) s.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString && outputCtx.state !== 'closed') {
              // Schedule gapless playback
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(
                decode(base64EncodedAudioString),
                outputCtx,
                24000,
                1,
              );
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            // Handle interruption signal from the model
            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                try { source.stop(); } catch(e) {}
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => setIsConnected(false),
          onerror: (err) => {
            console.error("CODQIT Live Sync Error:", err);
            setIsConnected(false);
          }
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Ecosystem link failed.");
      setIsConnected(false);
    }
  };

  const cleanup = async () => {
    if (sessionRef.current) {
      try { sessionRef.current.close(); } catch(e) {}
      sessionRef.current = null;
    }
    
    if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
      try { await inputAudioContextRef.current.close(); } catch(e) {}
    }
    if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
      try { await outputAudioContextRef.current.close(); } catch(e) {}
    }
    inputAudioContextRef.current = null;
    outputAudioContextRef.current = null;
    setIsConnected(false);
    setCallDuration(0);
    nextStartTimeRef.current = 0;
    sourcesRef.current.clear();
  };

  useEffect(() => {
    if (isOpen) {
      startCall();
    }
    return () => {
      cleanup();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
      <div className="relative w-full max-w-md bg-gray-900 border border-white/10 rounded-[3rem] overflow-hidden shadow-4xl animate-in zoom-in-95 duration-500">
        <div className="absolute top-0 left-0 w-full h-1 bg-indigo-500 animate-pulse"></div>
        
        <div className="p-10 flex flex-col items-center text-center">
          <div className="relative mb-6 mt-4">
            <div className={`absolute -inset-4 rounded-full bg-indigo-500/20 animate-ping ${isConnected ? 'opacity-100' : 'opacity-0'}`}></div>
            <img src={contactAvatar} className="w-28 h-28 rounded-[2rem] border-4 border-indigo-500/50 relative z-10 shadow-2xl object-cover" alt="" />
            {isConnected && (
              <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full border-4 border-gray-900 z-20">
                <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </div>

          <h3 className="text-xl font-black text-white mb-1 uppercase tracking-tighter">{contactName}</h3>
          
          {errorMessage ? (
            <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest mb-6 border border-red-500/20">
              {errorMessage}
            </div>
          ) : (
            <p className="text-indigo-400 font-black text-[9px] mb-6 uppercase tracking-[0.4em]">
              {isConnected ? `CODQIT_NEURAL_LINK • ${formatTime(callDuration)}` : 'ESTABLISHING_LINK...'}
            </p>
          )}

          <div className="w-full flex justify-center items-end gap-3 mb-10 h-8">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1 bg-indigo-500 rounded-full transition-all duration-150 ${isConnected ? 'animate-bounce' : 'opacity-10'}`}
                style={{ height: isConnected ? `${Math.random() * 24 + 8}px` : '4px', animationDelay: `${i * 0.05}s` }}
              ></div>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              disabled={!isConnected}
              className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all disabled:opacity-20 ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            >
              <span className="text-xl">{isMuted ? '🔇' : '🎤'}</span>
            </button>
            <button 
              onClick={onClose}
              className="w-18 h-18 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-600/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span className="text-3xl">🤙</span>
            </button>
            <button 
              disabled={!isConnected}
              className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center hover:bg-white/20 transition-all disabled:opacity-20"
            >
              <span className="text-xl">📹</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallingUI;
