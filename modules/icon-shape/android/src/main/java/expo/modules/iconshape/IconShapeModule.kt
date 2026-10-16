package expo.modules.iconshape

import android.content.res.Resources
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

// Системная форма иконок: SVG-путь в координатах 0..100 (круг на Pixel, сквиркл на Samsung)
class IconShapeModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("IconShape")

    Function("mask") {
      val res = Resources.getSystem()
      val id = res.getIdentifier("config_icon_mask", "string", "android")
      if (id == 0) null else res.getString(id)
    }
  }
}
