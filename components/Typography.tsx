/**
 * Typography Components - Reusable text components matching Figma design system
 */

import React from "react";
import { Text, TextProps, StyleSheet } from "react-native";
import { typography, TypographyStyle } from "../lib/typography";

interface TypographyProps extends TextProps {
  variant: TypographyStyle;
  children: React.ReactNode;
}

/**
 * Typography component that applies consistent text styles from the design system
 * 
 * @example
 * <Typography variant="brandHeader">platnm</Typography>
 * <Typography variant="heading1">Welcome</Typography>
 * <Typography variant="bodyMain">This is body text</Typography>
 */
export const Typography: React.FC<TypographyProps> = ({
  variant,
  children,
  style,
  ...props
}) => {
  return (
    <Text style={[typography[variant], style]} {...props}>
      {children}
    </Text>
  );
};

/**
 * Pre-defined typography components for convenience
 */
export const BrandHeader: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="brandHeader" {...props} />
);

export const Heading1: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="heading1" {...props} />
);

export const Heading2: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="heading2" {...props} />
);

export const BodyMain: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="bodyMain" {...props} />
);

export const BodyMedium: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="bodyMedium" {...props} />
);

export const CaptionMedium: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="captionMedium" {...props} />
);

export const CaptionMain: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="captionMain" {...props} />
);

export const CaptionFineLine: React.FC<Omit<TypographyProps, "variant">> = (props) => (
  <Typography variant="captionFineLine" {...props} />
);

