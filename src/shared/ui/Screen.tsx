import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import {
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';

const GAP = 16;

// iOS: automaticallyAdjustKeyboardInsets добавляет отступ и скроллит к полю.
// Android (edge-to-edge): окно под клавиатурой не сжимается, а KeyboardAvoidingView
// в модалках не срабатывает. Поэтому добавляем снизу отступ на высоту клавиатуры
// и докручиваем поле в фокусе целиком (нативно докручивается только строка с курсором).
export function Screen({ children }: { children: ReactNode }) {
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  // верх клавиатуры, пока ждем, когда контент вырастет на отступ и можно докрутить поле
  const pendingKeyboardTop = useRef<number | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // слушаем только на экране в фокусе, иначе скроллит и экран под модалкой
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const show = Keyboard.addListener('keyboardDidShow', (e) => {
        // screenY считается от верха экрана, а measureInWindow от низа статус-бара
        pendingKeyboardTop.current =
          e.endCoordinates.screenY - (StatusBar.currentHeight ?? 0);
        setKeyboardHeight(e.endCoordinates.height);
      });
      const hide = Keyboard.addListener('keyboardDidHide', () => {
        pendingKeyboardTop.current = null;
        setKeyboardHeight(0);
      });
      return () => {
        show.remove();
        hide.remove();
        pendingKeyboardTop.current = null;
        setKeyboardHeight(0);
      };
    }, []),
  );

  // докручиваем только после роста контента, иначе scrollTo упрется в старый низ
  const scrollFocusedIntoView = () => {
    const keyboardTop = pendingKeyboardTop.current;
    const input = TextInput.State.currentlyFocusedInput();
    pendingKeyboardTop.current = null;
    if (keyboardTop === null || !input) return;
    input.measureInWindow((_x, y, _w, h) => {
      const overlap = y + h + GAP - keyboardTop;
      if (overlap > 0) {
        scrollRef.current?.scrollTo({ y: scrollY.current + overlap });
      }
    });
  };

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 16 + keyboardHeight,
        gap: 12,
      }}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      onContentSizeChange={scrollFocusedIntoView}
      onScroll={(e) => (scrollY.current = e.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  );
}
