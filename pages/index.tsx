import type { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
import Image from "next/image";
import liff from "@line/liff";

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const SendMessageButton = () => {
  /* 追加: メッセージ送信 */
  const sendMessage = () => {
    liff
      .init({ liffId: process.env.REACT_APP_LIFF_ID as string }) // LIFF IDをセットする
      .then(() => {
        if (!liff.isLoggedIn()) {
          liff.login({}); // ログインしていなければ最初にログインする
        } else if (liff.isInClient()) {
          // LIFFので動いているのであれば
          liff
            .sendMessages([
              {
                // メッセージを送信する
                type: "text",
                text: "成功したぜ！Oh Yeah!! You've successfully sent a message! Hooray!",
              },
            ])
            .then(function () {
              window.alert("Message sent");
            })
            .catch(function (error) {
              window.alert("Error sending message: " + error);
            });
        }
      });
  };
  return (
    <button className="button" onClick={sendMessage}>
      SendMessage
    </button>
  );
};

const ShowProfileButton = () => {
  /* 追加: UserProfileをAlertで表示 */
  const getUserInfo = () => {
    liff.init({ liffId: process.env.REACT_APP_LIFF_ID as string }).then(() => {
      if (!liff.isLoggedIn()) {
        liff.login({}); // ログインしていなければ最初にログインする
      } else if (liff.isInClient()) {
        liff
          .getProfile() // ユーザ情報を取得する
          .then((profile) => {
            const userId: string = profile.userId;
            const displayName: string = profile.displayName;
            alert(`Name: ${displayName}, userId: ${userId}`);
          })
          .catch(function (error) {
            window.alert("Error sending message: " + error);
          });
      }
    });
  };
  return (
    <button className="button" onClick={getUserInfo}>
      Show user info
    </button>
  );
};

const videoConstraints = {
  width: 720,
  height: 360,
  facingMode: "user",
};

const Camera = () => {
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
      <ShowProfileButton />
      &nbsp;&nbsp;
      <SendMessageButton />
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
            <Image src={url} alt="Screenshot" width={540} height={360} />
          </div>
        </>
      )}
    </>
  );
};

const IndexPage = (props: Props) => {
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

export default IndexPage;
