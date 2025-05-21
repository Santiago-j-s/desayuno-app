/**
 * Get a random item using a cryptographically secure random number generator.
 * Uses modulo bias correction to ensure uniform distribution.
 */
export function getRandomItem<T>(array: T[]) {
  // Calculate the largest multiple of array.length that fits in a uint32
  const maxValue = Math.floor((0xffffffff + 1) / array.length) * array.length;

  while (true) {
    const randomBuffer = new Uint32Array(1);
    crypto.getRandomValues(randomBuffer);

    // Reject values that would create modulo bias
    if (randomBuffer[0] >= maxValue) continue;
    return array[randomBuffer[0] % array.length];
  }
}
