import { CSSProperties, MouseEvent, useEffect, useRef, useState } from 'react';
import styles from './App.module.css';
import { Challenge, NotCaptchaProps } from './types';
import { Transition } from 'react-transition-group';
import cn from 'classnames';
import Range from '../components/Range';
import Spinner from '../components/Spinner';
import { getNewChallenge, submitChallengeAnswer } from './network';
import snooze from '../utils/snooze';

const transitionStyles: Record<string, CSSProperties> = {
  entering: { opacity: 1, transform: 'translateY(0)' },
  entered: { opacity: 1, transform: 'translateY(0)' },
  exiting: { opacity: 0, transform: 'translateY(5px)' },
  exited: { opacity: 0, transform: 'translateY(5px)' },
};

export default function NotCaptcha({ children, onComplete }: NotCaptchaProps) {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const [challenge, setChallenge] = useState<Challenge | undefined>();
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const [raw, setRaw] = useState(0);

  const mount = async () => {
    const challenge = await getNewChallenge();
    setChallenge(challenge);
    new Image().src = challenge.captcha.structure.background;
    new Image().src = challenge.captcha.structure.rotatable;
    console.log('Challenge has been generated');
  };

  useEffect(() => {
    mount();
  }, []);

  const handleOnClickCaptcha = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleOnChange = (value: number) => {
    setRaw(value);
  };

  const handleOnSubmit = async (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    if (!challenge) return;

    e.preventDefault();

    setOpen(false);
    setSubmitting(true);

    const solved = await submitChallengeAnswer(challenge.id, raw);

    if (!solved) {
      await mount();
      await snooze(1000);

      setOpen(true);
      setRaw(0);
      setSubmitting(false);
    } else {
      setCompleted(true);
      onComplete && onComplete(challenge.id);
    }
  };

  if (!challenge) return null;

  return (
    <div className={styles.root}>
      <Transition nodeRef={nodeRef} in={open} timeout={100}>
        {(state) => (
          <div
            className={styles.captchaContainer}
            style={{
              ...transitionStyles[state],
            }}
            ref={nodeRef}
          >
            <div className={styles.captchaContainerHeader}>
              <span className={styles.catpchaContainerHeaderTitle}>
                notCAPTCHA
              </span>
            </div>
            <div className={styles.captchaContainerImageContainer}>
              <img
                className={styles.captchaContainerImageContainerBackground}
                src={challenge.captcha.structure.background}
              />
              <img
                className={styles.captchaContainerImageContainerRotatable}
                src={challenge.captcha.structure.rotatable}
                style={{ transform: `rotateZ(${raw * 360}deg)` }}
              />
              <div className={styles.captchaContainerImageContainerAttribution}>
                <span>Photo by</span>
                <a
                  target="_blank"
                  href={challenge.captcha.structure.author.profile_link}
                  className={
                    styles.captchaContainerImageContainerAttributionLink
                  }
                >
                  {challenge.captcha.structure.author.name}
                </a>
                <span>on</span>
                <a
                  target="_blank"
                  href="https://unsplash.com/?utm_source=NotCaptcha&utm_medium=referral"
                  className={
                    styles.captchaContainerImageContainerAttributionLink
                  }
                >
                  Unsplash
                </a>
              </div>
            </div>
            <div className={styles.captchaContainerFooter}>
              <Range
                min={0}
                max={1}
                step={0.001}
                onChange={handleOnChange}
                value={raw}
              />
            </div>
          </div>
        )}
      </Transition>
      <button
        disabled={(open && raw === 0) || submitting}
        className={cn(styles.button, {
          [styles.buttonCompleted]: completed,
        })}
        onClick={!open ? handleOnClickCaptcha : handleOnSubmit}
      >
        {!submitting && (children || open ? 'Submit' : 'I am not a robot')}
        {submitting && !completed && <Spinner />}
        {completed && (
          <svg
            className={styles.checkmark}
            focusable="false"
            aria-hidden="true"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            data-testid="CheckIcon"
          >
            <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}
