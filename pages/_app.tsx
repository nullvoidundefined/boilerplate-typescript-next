import "bootstrap/dist/css/bootstrap.min.css";

import "../src/view/style/global.css";

import type { AppProps } from "next/app";

import {
  selectUser,
  setUser,
  useHeaderAndFooterHeightOffset,
  useHeaderHeightOffset,
  useLagRadar,
  useWindowBreakpoint,
  wrapper,
} from "../src/state";
import { Layout, Modal } from "../src/view/component";
import { ReactNode, useRef } from "react";
import { ModalContext } from "../src/state";
import { useDispatch, useSelector } from "react-redux";
import { AuthRequestData, User } from "../src/type";
import { SignInModal } from "../src/view/component/modal/signIn/signIn";
import { noop } from "lodash";

const App = ({ Component: Route, pageProps }: AppProps) => {
  const user = useSelector(selectUser);
  const contentHeightOffset = useHeaderAndFooterHeightOffset();
  const navigationDropdownHeightOffset = useHeaderHeightOffset();
  const { isMobile } = useWindowBreakpoint();

  const dispatch = useDispatch();

  useLagRadar();

  const modalRef = useRef({
    hideModal: () => noop(),
    showModal: (modalContent: ReactNode) => modalContent,
  });

  const hideModal = () => {
    modalRef.current.hideModal();
  };

  const onSignInFormSubmit = (signUpData: AuthRequestData) => {
    const { password, email } = signUpData;
    fetch(`/api/auth/signIn?password=${password}&userName=${email}`)
      .then((response) => response.json())
      .then((userData) => updateUser(userData))
      .catch((error) => console.log(error));
  };

  const showSignInModal = () =>
    showModal(<SignInModal onFormSubmit={onSignInFormSubmit} />);

  const showModal = (modalContent: ReactNode) => {
    modalRef.current.showModal(modalContent);
  };

  const updateUser = (user: User) => {
    dispatch(setUser(user));
  };

  return (
    <>
      <Modal ref={modalRef} />
      <ModalContext.Provider value={{ hideModal, showModal }}>
        <Layout
          contentHeightOffset={contentHeightOffset}
          navigationDropdownHeightOffset={navigationDropdownHeightOffset}
          isMobile={isMobile}
          onLogInButtonClick={showSignInModal}
          onLogOutButtonClick={() => noop}
          user={user}
        >
          <Route {...pageProps} />
        </Layout>
      </ModalContext.Provider>
    </>
  );
};

export default wrapper.withRedux(App);
