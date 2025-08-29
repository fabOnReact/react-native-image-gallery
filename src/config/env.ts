export const PEXELS_API_KEY = process.env.PEXELS_API_KEY ?? '';

if (!PEXELS_API_KEY) {
  console.warn('PEXELS_API_KEY environment variable is not defined');
}
