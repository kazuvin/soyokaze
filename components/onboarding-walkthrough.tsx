import { useState, useRef } from "react";
import {
  View,
  Dimensions,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Spacing, BorderRadius, ColorPalette } from "@/constants/design-tokens";

const { width: screenWidth } = Dimensions.get("window");

type OnboardingSlide = {
  id: string;
  title: string;
  description: string;
  icon: string;
};

const slides: OnboardingSlide[] = [
  {
    id: "welcome",
    title: "ようこそ",
    description: "Soyokazeへようこそ。このアプリがあなたの日常をより便利にします。",
    icon: "👋",
  },
  {
    id: "features",
    title: "豊富な機能",
    description: "様々な便利機能を使って、効率的にタスクを管理できます。",
    icon: "⚡",
  },
  {
    id: "customization",
    title: "カスタマイズ",
    description: "お好みに合わせてアプリの設定をカスタマイズできます。",
    icon: "🎨",
  },
  {
    id: "start",
    title: "始めましょう",
    description: "準備が整いました。さっそくSoyokazeを使い始めましょう！",
    icon: "🚀",
  },
];

type OnboardingWalkthroughProps = {
  onComplete: () => void;
};

export function OnboardingWalkthrough({ onComplete }: OnboardingWalkthroughProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { theme } = useTheme();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(slideIndex);
  };

  const goToNextSlide = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const goToPreviousSlide = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      scrollViewRef.current?.scrollTo({
        x: prevIndex * screenWidth,
        animated: true,
      });
      setCurrentIndex(prevIndex);
    }
  };

  const isLastSlide = currentIndex === slides.length - 1;
  const isFirstSlide = currentIndex === 0;

  return (
    <ThemedView 
      style={{ 
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        flex: 1,
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {slides.map((slide) => (
          <View
            key={slide.id}
            style={{
              width: screenWidth,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: Spacing[8],
            }}
          >
            <View
              style={{
                alignItems: "center",
                maxWidth: 320,
              }}
            >
              <ThemedText
                style={{
                  fontSize: 64,
                  marginBottom: Spacing[8],
                  textAlign: "center",
                }}
              >
                {slide.icon}
              </ThemedText>
              
              <ThemedText
                style={{
                  fontSize: 28,
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: Spacing[6],
                  color: theme.text.primary,
                }}
              >
                {slide.title}
              </ThemedText>
              
              <ThemedText
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  lineHeight: 24,
                  color: theme.text.secondary,
                }}
              >
                {slide.description}
              </ThemedText>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Page Indicators */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: Spacing[6],
          gap: Spacing[2],
        }}
      >
        {slides.map((_, index) => (
          <View
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: BorderRadius.full,
              backgroundColor:
                index === currentIndex
                  ? theme.brand.primary
                  : ColorPalette.neutral[300],
            }}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: Spacing[6],
          paddingBottom: Spacing[8],
          gap: Spacing[4],
        }}
      >
        <Button
          title="戻る"
          variant="ghost"
          onPress={goToPreviousSlide}
          disabled={isFirstSlide}
          style={{ opacity: isFirstSlide ? 0 : 1 }}
        />

        <View style={{ flex: 1 }} />

        {isLastSlide ? (
          <Button
            title="始める"
            variant="primary"
            onPress={onComplete}
          />
        ) : (
          <Button
            title="次へ"
            variant="primary"
            onPress={goToNextSlide}
          />
        )}
      </View>
    </ThemedView>
  );
}