export const requestWithError = (
  callback: (req: Express.Request) => Promise<void>,
  errorMessage = 'Fatal: Something went wrong',
): ((req: Express.Request) => Promise<void>) => {
  return async (req: Express.Request) => {
    try {
      await callback(req);
      return;
    } catch (error) {
      console.error(error);
      req.response.error((error as Error).message ?? errorMessage);
    }
  };
};
