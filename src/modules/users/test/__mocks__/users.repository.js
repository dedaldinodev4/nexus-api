

export function userRepositoryMock() {
  return {
    findById: async () => null,
    findByEmail: async () => null,
    findByEmailWithPassword: async () => null,
    findMany: async () => [],
    count: async () => 0,
    update: async (id, data) => ({
      id,
      ...input
    }),
    remove: async () => {}
  };
}