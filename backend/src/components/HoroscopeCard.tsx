
import React from 'react';
import { View, Text } from 'react-native';

interface HoroscopeCardProps {
  sign: string;
  content: string;
  actionPrompt: string;
  tags: string[];
}

const HoroscopeCard: React.FC<HoroscopeCardProps> = ({ sign, content, actionPrompt, tags }) => {
  return (
    <View>
      <Text>Horoscope for {sign}</Text>
      <Text>{content}</Text>
      <Text>{actionPrompt}</Text>
      <Text>Tags: {tags.join(', ')}</Text>
    </View>
  );
};

export default HoroscopeCard;
