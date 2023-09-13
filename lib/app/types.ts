import { ReactNode } from 'react';

export interface NotCaptchaProps {
  children?: ReactNode;
  onComplete?: (challengeId: string) => void;
}

export type Source = 'UNSPLASH';

export type Author = {
  name: string;
  profile_link: string;
};

export type Captcha = {
  source: Source;
  structure: {
    author: Author;
    background: string;
    rotatable: string;
  };
};

export type Challenge = {
  id: string;
  captcha: Captcha;
};
