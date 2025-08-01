import React from 'react';
import {
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
} from 'react-native';
import { Container } from './Container';

interface KeyboardAvoidingContainerProps extends KeyboardAvoidingViewProps {
  children: React.ReactNode;
}

export function KeyboardAvoidingContainer({
  children,
  style,
  ...props
}: KeyboardAvoidingContainerProps) {
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      {...props}
    >
      <Container safeArea={false}>
        {children}
      </Container>
    </KeyboardAvoidingView>
  );
}