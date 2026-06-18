// Bun test preload — sets up happy-dom on the global object so
// @testing-library/react can call document.body etc. Loaded via
// bunfig.toml.
import { GlobalRegistrator } from '@happy-dom/global-registrator';

GlobalRegistrator.register();
