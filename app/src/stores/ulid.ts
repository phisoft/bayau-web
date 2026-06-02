const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'

function encodeTime(time: number, len: number): string {
  let str = ''
  for (let i = len - 1; i >= 0; i--) {
    str = ENCODING.charAt(time % 32) + str
    time = Math.floor(time / 32)
  }
  return str
}

function encodeRandom(len: number): string {
  let str = ''
  const bytes = crypto.getRandomValues(new Uint8Array(len))
  for (let i = 0; i < len; i++) {
    str += ENCODING.charAt(bytes[i] % 32)
  }
  return str
}

export function ulid(): string {
  return encodeTime(Date.now(), 10) + encodeRandom(16)
}

export function uid(prefix: string): string {
  return prefix + '_' + ulid()
}
