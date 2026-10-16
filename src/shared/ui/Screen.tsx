import { useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState, type ReactNode } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const GAP = 16;

type Props = {
  children: ReactNode;
  // кнопки, закрепленные внизу экрана: контент скроллится над ними
  footer?: ReactNode;
};

// iOS: automaticallyAdjustKeyboardInsets добавляет отступ и скроллит к полю.
// Android (edge-to-edge): окно под клавиатурой не сжимается, а KeyboardAvoidingView
// в модалках не срабатывает. Поэтому добавляем снизу отступ на высоту клавиатуры
// (с футером - поднимаем футер над ней) и докручиваем поле в фокусе целиком
// (нативно докручивается только строка с курсором).
export function Screen({ children, footer }: Props) {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const footerRef = useRef<View>(null);
  const scrollY = useRef(0);
  // верх клавиатуры, пока ждем, когда контент вырастет на отступ и можно докрутить поле
  const pendingKeyboardTop = useRef<number | null>(null);
  // сколько клавиатура закрывает снизу экрана
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // слушаем только на экране в фокусе, иначе скроллит и экран под модалкой
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return;
      const show = Keyboard.addListener('keyboardDidShow', (e) => {
        // screenY считается от верха экрана, а measureInWindow от низа статус-бара
        pendingKeyboardTop.current =
          e.endCoordinates.screenY - (StatusBar.currentHeight ?? 0);
        // от низа экрана, а не height: так не важно, входит ли в нее панель навигации
        setKeyboardHeight(
          Dimensions.get('screen').height - e.endCoordinates.screenY,
        );
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

  // докручиваем только после того, как место под поле появилось: без футера контент
  // вырос на отступ, с футером он поднялся и скролл сжался. Иначе scrollTo упрется в старый низ
  const scrollFocusedIntoView = () => {
    const keyboardTop = pendingKeyboardTop.current;
    const input = TextInput.State.currentlyFocusedInput();
    if (keyboardTop === null || !input) return;
    pendingKeyboardTop.current = null;
    const scrollTo = (limit: number) =>
      input.measureInWindow((_x, y, _w, h) => {
        const overlap = y + h + GAP - limit;
        if (overlap > 0) {
          scrollRef.current?.scrollTo({ y: scrollY.current + overlap });
        }
      });
    if (footerRef.current) {
      footerRef.current.measureInWindow((_x, y) => scrollTo(y));
    } else {
      scrollTo(keyboardTop);
    }
  };

  const scroll = (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 16 + (footer ? 0 : keyboardHeight),
        gap: 12,
      }}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      onContentSizeChange={scrollFocusedIntoView}
      onLayout={footer ? scrollFocusedIntoView : undefined}
      onScroll={(e) => (scrollY.current = e.nativeEvent.contentOffset.y)}
      scrollEventThrottle={16}
    >
      {children}
    </ScrollView>
  );

  if (!footer) {
    return scroll;
  }

  return (
    <View style={{ flex: 1 }}>
      {scroll}
      <View
        ref={footerRef}
        style={{
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 16 + (keyboardHeight || insets.bottom),
          gap: 12,
        }}
      >
        {footer}
      </View>
    </View>
  );
}
