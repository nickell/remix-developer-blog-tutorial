export function instanceOfNodeError<T extends new (...args: any) => Error>(
  value: unknown,
  errorType: T
): value is InstanceType<T> & NodeJS.ErrnoException {
  return value instanceof errorType
}

export function dateToString(d: Date) {
  return d.toISOString().split('T')[0]
}
