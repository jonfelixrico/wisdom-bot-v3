type TryCatchResults<T> = [Error, T] | [Error]

export async function flatTryCatchAsync<T = void>(
  fn: () => Promise<T>,
): Promise<TryCatchResults<T>> {
  try {
    const returnValue = await fn()
    return [null, returnValue]
  } catch (e) {
    return [e]
  }
}
