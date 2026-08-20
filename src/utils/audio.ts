// Sound utility functions (disabled/no-op)

export function toggleAudioMute(): boolean {
  return true;
}

export const toggleMute = toggleAudioMute;

export function getAudioMuteState(): boolean {
  return true;
}

export const isMuted = getAudioMuteState;

export function playHoverSound() {}

export function playClickSound() {}

export function playSuccessFanfare() {}

