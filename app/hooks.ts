import { useParams } from 'remix'
import invariant from 'tiny-invariant'

export function useParam(name: string): string {
  const params = useParams()
  const param = params[name]
  invariant(param)
  return param
}
