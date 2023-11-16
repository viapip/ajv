export function validate11(
  data,
  { instancePath = '' } = {},
) {
  /* # sourceURL="foo" */ let vErrors = null
  let errors = 0
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.bar === undefined || !func0.call(data, 'bar')) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'bar' },
        message: 'must have required property \'' + 'bar' + '\'',
        schema: schema13.required,
        parentSchema: schema13,
        data,
      }
      if (vErrors === null) {
        vErrors = [err0]
      }
      else {
        vErrors.push(err0)
      }
      errors++
    }
    for (const key0 of Object.keys(data)) {
      if (!(key0 === 'bar')) {
        const err1 = {
          instancePath,
          schemaPath: '#/additionalProperties',
          keyword: 'additionalProperties',
          params: { additionalProperty: key0 },
          message: 'must NOT have additional properties',
          schema: false,
          parentSchema: schema13,
          data,
        }
        if (vErrors === null) {
          vErrors = [err1]
        }
        else {
          vErrors.push(err1)
        }
        errors++
      }
    }
    if (data.bar !== undefined && func0.call(data, 'bar')) {
      const data0 = data.bar
      if (typeof data0 !== 'string') {
        const err2 = {
          instancePath: `${instancePath}/bar`,
          schemaPath: '#/properties/bar/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
          schema: schema13.properties.bar.type,
          parentSchema: schema13.properties.bar,
          data: data0,
        }
        if (vErrors === null) {
          vErrors = [err2]
        }
        else {
          vErrors.push(err2)
        }
        errors++
      }
    }
  }
  else {
    const err3 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
      schema: schema13.type,
      parentSchema: schema13,
      data,
    }
    if (vErrors === null) {
      vErrors = [err3]
    }
    else {
      vErrors.push(err3)
    }
    errors++
  }
  validate11.errors = vErrors

  return errors === 0
}
