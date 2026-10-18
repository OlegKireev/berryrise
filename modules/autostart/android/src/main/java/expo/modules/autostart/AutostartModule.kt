package expo.modules.autostart

import android.app.AppOpsManager
import android.os.Process
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Автозапуск MIUI/HyperOS: скрытая операция AppOps 10008. Публичного API нет,
// поэтому null на любой непонятный ответ и ошибку
private const val OP_AUTO_START = 10008

class AutostartModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("Autostart")

    Function("enabled") {
      try {
        val context = appContext.reactContext ?: return@Function null
        val ops = context.getSystemService(AppOpsManager::class.java)
        val check = AppOpsManager::class.java.getMethod(
          "checkOpNoThrow",
          Int::class.javaPrimitiveType,
          Int::class.javaPrimitiveType,
          String::class.java,
        )

        when (check.invoke(ops, OP_AUTO_START, Process.myUid(), context.packageName)) {
          AppOpsManager.MODE_ALLOWED -> true
          AppOpsManager.MODE_IGNORED, AppOpsManager.MODE_ERRORED -> false
          else -> null
        }
      } catch (e: Exception) {
        null
      }
    }
  }
}
