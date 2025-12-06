import Navigation from '../components/Navigation';
import VolumeControl from '../components/VolumeControl';
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <VolumeControl />
      <Navigation />
    </>
  );
}
