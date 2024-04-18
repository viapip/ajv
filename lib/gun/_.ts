// declare module 'gun' {
//   interface IGunUserInstance {
//     asyncCreate(
//       alias: string,
//       password: string,
//     ): Promise<Parameters<GunCallbackUserCreate>[0]>
//   }
// }

// user.asyncCreate = (alias, password) => new Promise((resolve, reject) => {
//   user
//     .create(alias, password, data =>
//       match(data)
//         .with({ err: P.string }, (t) => {
//           logger.error('user.create:', t.err)
//           reject(t)
//         })
//         .otherwise((t) => {
//           logger.success('user.create:', t.pub)
//           resolve(t)
//         }))
// })

// try {
//   await user.asyncCreate(config.alias, config.password)
// } catch (error) {
//   logger.error('user.create:', error)
// }
