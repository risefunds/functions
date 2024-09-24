import { Container } from '../backendContainer/Container';

let container: Container | undefined;

export const getContainer = async (): Promise<Container> => {
  if (!container || !container.initialized) {
    container = new Container();
    await container.init();
  }

  if (!container.initialized) throw new Error('Container not initialized');
  return container;
};
