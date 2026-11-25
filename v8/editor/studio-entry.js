/* One Studio entrypoint: every template (01-04) runs on the shared IP ONLY core editor. */
import {applyStudioVersion} from '/v8/version.js';
applyStudioVersion();
await import('/v8/app.js');
