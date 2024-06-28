// import type { JSONSchema7TypeName } from 'json-schema'

import type { JSONSchema7, JSONSchema7TypeName } from 'json-schema'

export const Widgets: Record<string, Record<string, string>> = {
  string: {
    email: 'EditorWidgetEmail',
    date: 'EditorWidgetDate',
    time: 'EditorWidgetTime',
    default: 'EditorWidgetText',
  },
  number: {
    default: 'EditorWidgetNumber',
  },
} as const

export const mapFields: Record<JSONSchema7TypeName, string> = {
  string: 'EditorFieldsString',
  number: 'EditorFieldsNumber',
  integer: 'EditorFieldsNumber',
  boolean: 'EditorFieldsBoolean',
  object: 'EditorFieldsObject',
  array: 'EditorFieldsArray',
  null: 'EditorFieldsNull',
} as const

export const withSpecialChilds = ['properties', 'definitions', 'required']

type MapSchemaObject = Omit<JSONSchema7, 'type'> & { type: JSONSchema7TypeName }
export function getMapSchema(schema: JSONSchema7) {
  const map = ref(new Map<string, MapSchemaObject>())

  traverse(schema, (
    s,
    key,
  ) => {
    if (key && !withSpecialChilds.includes(key))
      map.value.set(key, { $id: key, ...s })
  })
  return map
}

export function getWidget<T extends keyof typeof Widgets>(type: T, format?: keyof typeof Widgets[T]) {
  if (!format)
    return Widgets[type].default

  const widget = Widgets[type][format]

  return widget || Widgets[type].default
}
