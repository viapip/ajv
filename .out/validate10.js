export function validate10(
  data,
  { instancePath = '' } = {},
) {
  /* # sourceURL="bar" */ let vErrors = null
  let errors = 0
  if (data && typeof data == 'object' && !Array.isArray(data)) {
    if (data.baz === undefined || !func0.call(data, 'baz')) {
      const err0 = {
        instancePath,
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'baz' },
        message: 'must have required property \'' + 'baz' + '\'',
        schema: schema11.required,
        parentSchema: schema11,
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
      if (!(key0 === 'bar' || key0 === 'baz')) {
        const data0 = data[key0]
        if (data0 && typeof data0 == 'object' && !Array.isArray(data0)) {
          if (data0.bar1 === undefined || !func0.call(data0, 'bar1')) {
            const err1 = {
              instancePath: `${instancePath}/${key0
                .replace(/~/g, '~0')
                .replace(/\//g, '~1')}`,
              schemaPath: '#/additionalProperties/required',
              keyword: 'required',
              params: { missingProperty: 'bar1' },
              message: 'must have required property \'' + 'bar1' + '\'',
              schema: schema11.additionalProperties.required,
              parentSchema: schema11.additionalProperties,
              data: data0,
            }
            if (vErrors === null) {
              vErrors = [err1]
            }
            else {
              vErrors.push(err1)
            }
            errors++
          }
          if (data0.bar1 !== undefined && func0.call(data0, 'bar1')) {
            const data1 = data0.bar1
            if (typeof data1 !== 'string') {
              const err2 = {
                instancePath: `${instancePath}/${key0
                  .replace(/~/g, '~0')
                  .replace(/\//g, '~1')}/bar1`,
                schemaPath: '#/properties/bar/type',
                keyword: 'type',
                params: { type: 'string' },
                message: 'must be string',
                schema: schema12.type,
                parentSchema: schema12,
                data: data1,
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
            instancePath: `${instancePath}/${key0
              .replace(/~/g, '~0')
              .replace(/\//g, '~1')}`,
            schemaPath: '#/additionalProperties/type',
            keyword: 'type',
            params: { type: 'object' },
            message: 'must be object',
            schema: schema11.additionalProperties.type,
            parentSchema: schema11.additionalProperties,
            data: data0,
          }
          if (vErrors === null) {
            vErrors = [err3]
          }
          else {
            vErrors.push(err3)
          }
          errors++
        }
      }
    }
    if (data.bar !== undefined && func0.call(data, 'bar')) {
      const data2 = data.bar
      if (typeof data2 !== 'string') {
        const err4 = {
          instancePath: `${instancePath}/bar`,
          schemaPath: '#/properties/bar/type',
          keyword: 'type',
          params: { type: 'string' },
          message: 'must be string',
          schema: schema11.properties.bar.type,
          parentSchema: schema11.properties.bar,
          data: data2,
        }
        if (vErrors === null) {
          vErrors = [err4]
        }
        else {
          vErrors.push(err4)
        }
        errors++
      }
    }
    if (data.baz !== undefined && func0.call(data, 'baz')) {
      const data3 = data.baz
      if (data3 && typeof data3 == 'object' && !Array.isArray(data3)) {
        if (data3.bar === undefined || !func0.call(data3, 'bar')) {
          const err5 = {
            instancePath: `${instancePath}/baz`,
            schemaPath: 'foo/required',
            keyword: 'required',
            params: { missingProperty: 'bar' },
            message: 'must have required property \'' + 'bar' + '\'',
            schema: schema13.required,
            parentSchema: schema13,
            data: data3,
          }
          if (vErrors === null) {
            vErrors = [err5]
          }
          else {
            vErrors.push(err5)
          }
          errors++
        }
        for (const key1 of Object.keys(data3)) {
          if (!(key1 === 'bar')) {
            const err6 = {
              instancePath: `${instancePath}/baz`,
              schemaPath: 'foo/additionalProperties',
              keyword: 'additionalProperties',
              params: { additionalProperty: key1 },
              message: 'must NOT have additional properties',
              schema: false,
              parentSchema: schema13,
              data: data3,
            }
            if (vErrors === null) {
              vErrors = [err6]
            }
            else {
              vErrors.push(err6)
            }
            errors++
          }
        }
        if (data3.bar !== undefined && func0.call(data3, 'bar')) {
          const data4 = data3.bar
          if (typeof data4 !== 'string') {
            const err7 = {
              instancePath: `${instancePath}/baz/bar`,
              schemaPath: 'foo/properties/bar/type',
              keyword: 'type',
              params: { type: 'string' },
              message: 'must be string',
              schema: schema13.properties.bar.type,
              parentSchema: schema13.properties.bar,
              data: data4,
            }
            if (vErrors === null) {
              vErrors = [err7]
            }
            else {
              vErrors.push(err7)
            }
            errors++
          }
        }
      }
      else {
        const err8 = {
          instancePath: `${instancePath}/baz`,
          schemaPath: 'foo/type',
          keyword: 'type',
          params: { type: 'object' },
          message: 'must be object',
          schema: schema13.type,
          parentSchema: schema13,
          data: data3,
        }
        if (vErrors === null) {
          vErrors = [err8]
        }
        else {
          vErrors.push(err8)
        }
        errors++
      }
    }
  }
  else {
    const err9 = {
      instancePath,
      schemaPath: '#/type',
      keyword: 'type',
      params: { type: 'object' },
      message: 'must be object',
      schema: schema11.type,
      parentSchema: schema11,
      data,
    }
    if (vErrors === null) {
      vErrors = [err9]
    }
    else {
      vErrors.push(err9)
    }
    errors++
  }
  validate10.errors = vErrors

  return errors === 0
}
