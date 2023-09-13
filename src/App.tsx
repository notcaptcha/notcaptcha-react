import NotCaptcha from '../lib/app';

function App() {
  const handleOnComplete = (challengeId: string) => {
    console.log('This executes after the captcha is complete and verified.');
    console.log(`Challenge ${challengeId}`);
  };

  return (
    <div className="root">
      <NotCaptcha onComplete={handleOnComplete}>Post</NotCaptcha>
    </div>
  );
}

export default App;
