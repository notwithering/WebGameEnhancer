import * as qol from "./qol";
import * as sensitivity from "./sensitivity";
import * as bridge from "./bridge";

qol.removeFocusOutlines();
qol.blockMouseNavigation();
qol.patchPointerLock();
qol.patchFullscreen();
sensitivity.install();
bridge.install();
