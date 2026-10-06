import * as commands from "./commands";
import * as qol from "./qol";
import * as sensitivity from "./sensitivity";

commands.install();
qol.removeFocusOutlines();
qol.blockMouseNavigation();
qol.patchPointerLock();
sensitivity.install();
