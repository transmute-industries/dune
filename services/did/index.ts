import web from './web'

const identifier = {
  replace: (doc:Record<string, unknown>, source:string, target:string) => {
    return JSON.parse(
      JSON.stringify(doc, function replacer(key, value) {
        if (value === source) {
          return target
        }
        return value
      }),
    )
  },
}

const did = { identifier, web }

export default did;