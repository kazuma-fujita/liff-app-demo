import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

export const Camera = () => {
  const [isCaptureEnable, setCaptureEnable] = useState<boolean>(false);
  const webcamRef = useRef<Webcam>(null);
  const [url, setUrl] = useState<string | null>(null);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  return (
    <>
      <header>
        <h1>Camera</h1>
      </header>
      {isCaptureEnable || (
        <button onClick={() => setCaptureEnable(true)}>Launch</button>
      )}
      {isCaptureEnable && (
        <>
          <div>
            <button onClick={() => setCaptureEnable(false)}>Finish</button>
          </div>
          <div>
            <Webcam
              audio={false}
              width={540}
              height={360}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />
          </div>
          <button onClick={capture}>Capture</button>
        </>
      )}
      {url && (
        <>
          <div>
            <button
              onClick={() => {
                setUrl(null);
              }}
            >
              Delete
            </button>
          </div>
          <div>
            <Image src={url} alt="Screenshot" />
          </div>
        </>
      )}
    </>
  );
};

export const IndexPage = (props: Props) => {
  return (
    <>
      <Head>
        <title>{props.pageTitle}</title>
      </Head>
      <Camera />
    </>
  );
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return {
    props: {
      pageTitle: "LIFF App demo",
    },
  };
};
