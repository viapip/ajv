import consolaGlobalInstance from 'consola'

export function useConsola(tag?: string) {
  return !tag
    ? consolaGlobalInstance
    : consolaGlobalInstance.create({ defaults: { tag } })
}
