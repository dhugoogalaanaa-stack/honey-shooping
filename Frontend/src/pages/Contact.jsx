import { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

// SVG Icon Components
const TwitterIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 1200 1227"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M714.163 519.284L1160.89 0H1055.03L667.137 450.887L357.328 0H0L468.492 681.821L0 1226.37H105.866L515.491 750.218L842.672 1226.37H1200L714.137 519.284H714.163ZM569.165 687.828L521.697 619.934L144.011 79.6944H306.615L611.412 515.685L658.88 583.579L1055.08 1150.3H892.476L569.165 687.854V687.828Z"
      fill="currentColor"
    />
  </svg>
);

const InstagramIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 56.7 56.7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M28.2,16.7c-7,0-12.8,5.7-12.8,12.8s5.7,12.8,12.8,12.8S41,36.5,41,29.5S35.2,16.7,28.2,16.7z M28.2,37.7c-4.5,0-8.2-3.7-8.2-8.2s3.7-8.2,8.2-8.2s8.2,3.7,8.2,8.2S32.7,37.7,28.2,37.7z"
      fill="currentColor"
    />
    <circle cx="41.5" cy="16.4" r="2.9" fill="currentColor" />
    <path
      d="M49,8.9c-2.6-2.7-6.3-4.1-10.5-4.1H17.9c-8.7,0-14.5,5.8-14.5,14.5v20.5c0,4.3,1.4,8,4.2,10.7c2.7,2.6,6.3,3.9,10.4,3.9h20.4c4.3,0,7.9-1.4,10.5-3.9c2.7-2.6,4.1-6.3,4.1-10.6V19.3C53,15.1,51.6,11.5,49,8.9z M48.6,39.9c0,3.1-1.1,5.6-2.9,7.3s-4.3,2.6-7.3,2.6H18c-3,0-5.5-0.9-7.3-2.6C8.9,45.4,8,42.9,8,39.8V19.3c0-3,0.9-5.5,2.7-7.3c1.7-1.7,4.3-2.6,7.3-2.6h20.6c3,0,5.5,0.9,7.3,2.7c1.7,1.8,2.7,4.3,2.7,7.2V39.9L48.6,39.9z"
      fill="currentColor"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 56.693 56.693"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M40.43,21.739h-7.645v-5.014c0-1.883,1.248-2.322,2.127-2.322c0.877,0,5.395,0,5.395,0V6.125l-7.43-0.029c-8.248,0-10.125,6.174-10.125,10.125v5.518h-4.77v8.53h4.77c0,10.947,0,24.137,0,24.137h10.033c0,0,0-13.32,0-24.137h6.77L40.43,21.739z"
      fill="currentColor"
    />
  </svg>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    emoji: "👍",
  });
  const [activeField, setActiveField] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [emailjsConfigured, setEmailjsConfigured] = useState(false);
  const controls = useAnimation();
  const formRef = useRef();

  const emojiOptions = ["👍", "👋", "😊", "🚀"];

  // Social media links
  const socialLinks = {
    twitter: "https://twitter.com/honeynest",
    instagram: "https://instagram.com/honeynest",
    facebook: "https://facebook.com/honeynest",
  };

  const handleSocialClick = (platform) => {
    window.open(socialLinks[platform], "_blank", "noopener,noreferrer");
  };

  useEffect(() => {
    // Check if EmailJS is properly configured
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      setEmailjsConfigured(true);
      emailjs.init(publicKey);
    } else {
      setEmailjsConfigured(false);
      setErrorMessage(
        "Email service is not configured. Please check your environment variables."
      );
    }

    const sequence = async () => {
      await controls.start({ opacity: 1, y: 0 }, { duration: 0.5 });
      await controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 },
      });
    };
    sequence();
  }, [controls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailjsConfigured) {
      setSubmitStatus("error");
      setErrorMessage(
        "Email service is not configured. Please check your environment variables."
      );
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    await controls.start({
      scale: 0.98,
      transition: { duration: 0.2 },
    });

    try {
      const result = await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current
      );

      console.log("Email sent successfully:", result.text);

      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        message: "",
        emoji: "👍",
      });

      await controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 },
      });

      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      console.error("Failed to send message:", error);

      setIsSubmitting(false);
      setSubmitStatus("error");
      setErrorMessage(
        error.text ||
          `Failed to send message. Error: ${error.message || "Unknown error"}`
      );

      await controls.start({
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.5 },
      });
    }
  };

  return (
    <PageContainer>
      <AnimatedBackground />

      <ContactContainer initial={{ opacity: 0, y: 20 }} animate={controls}>
        <LeftSide>
          <TitleContainer>
            <Title>Let's Talk</Title>
            <Subtitle>
              We're here to help with any questions about our honey products
            </Subtitle>
          </TitleContainer>

          <ContactMethods>
            {[
              {
                icon: "✉️",
                title: "Email",
                text: "support@honeynest.cc",
                color: "#1E3A5F", // Navy
              },
              {
                icon: "📱",
                title: "Phone",
                text: "+1 (555) 123-4567",
                color: "#4A5D23", // Olive Green
              },
              {
                icon: "📍",
                title: "Office",
                text: "123 Honeycomb Lane, Sweetville, CA 90210",
                color: "#1E3A5F", // Navy
              },
            ].map((item, index) => (
              <ContactMethod
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                whileHover={{ y: -5 }}
                style={{ borderLeft: `4px solid ${item.color}` }}
              >
                <MethodIcon>{item.icon}</MethodIcon>
                <ContactMethodContent>
                  <ContactMethodTitle>{item.title}</ContactMethodTitle>
                  <ContactMethodText>{item.text}</ContactMethodText>
                </ContactMethodContent>
              </ContactMethod>
            ))}
          </ContactMethods>

          <SocialLinks>
            {["twitter", "instagram", "facebook"].map((platform, i) => (
              <SocialIcon
                key={platform}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  delay: 0.5 + i * 0.1,
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                }}
                whileHover={{ y: -5, scale: 1.1 }}
                onClick={() => handleSocialClick(platform)}
              >
                {platform === "twitter" && <TwitterIcon />}
                {platform === "instagram" && <InstagramIcon />}
                {platform === "facebook" && <FacebookIcon />}
              </SocialIcon>
            ))}
          </SocialLinks>
        </LeftSide>

        <RightSide>
          <FormContainer>
            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <SuccessMessage
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <Confetti>
                    {[...Array(30)].map((_, i) => (
                      <motion.div
                        key={i}
                        style={{
                          position: "absolute",
                          background: [
                            "#1E3A5F",
                            "#4A5D23",
                            "#2C2C2C",
                            "#1E3A5F",
                          ][Math.floor(Math.random() * 4)],
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                        }}
                        initial={{
                          y: 0,
                          x: Math.random() * 100 - 50,
                          opacity: 0,
                        }}
                        animate={{
                          y: [0, -100],
                          x: [0, Math.random() * 100 - 50],
                          opacity: [0, 1, 0],
                        }}
                        transition={{
                          duration: 1.5,
                          delay: i * 0.05,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />
                    ))}
                  </Confetti>
                  <SuccessIcon
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 0.8,
                      ease: "backInOut",
                    }}
                  >
                    🎉
                  </SuccessIcon>
                  <SuccessTitle>Message Sent!</SuccessTitle>
                  <SuccessText>We'll get back to you soon</SuccessText>
                </SuccessMessage>
              ) : submitStatus === "error" ? (
                <ErrorMessage
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                >
                  <ErrorIcon>❌</ErrorIcon>
                  <ErrorTitle>Oops! Something went wrong</ErrorTitle>
                  <ErrorText>{errorMessage}</ErrorText>
                  <RetryButton
                    onClick={() => setSubmitStatus(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Again
                  </RetryButton>
                </ErrorMessage>
              ) : (
                <Form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  onSubmit={handleSubmit}
                  ref={formRef}
                >
                  <FormGroup>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setActiveField("name")}
                      onBlur={() => setActiveField(null)}
                      required
                      placeholder=" "
                    />
                    <Label
                      active={activeField === "name"}
                      inputValue={formData.name}
                    >
                      Your Name
                    </Label>
                    <Underline active={activeField === "name"} />
                  </FormGroup>

                  <FormGroup>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setActiveField("email")}
                      onBlur={() => setActiveField(null)}
                      required
                      placeholder=" "
                    />
                    <Label
                      active={activeField === "email"}
                      inputValue={formData.email}
                    >
                      Email
                    </Label>
                    <Underline active={activeField === "email"} />
                  </FormGroup>

                  <FormGroup>
                    <TextArea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setActiveField("message")}
                      onBlur={() => setActiveField(null)}
                      required
                      placeholder=" "
                    />
                    <Label
                      active={activeField === "message"}
                      inputValue={formData.message}
                    >
                      Your Message
                    </Label>
                    <Underline active={activeField === "message"} />
                  </FormGroup>

                  <EmojiSelector>
                    <EmojiLabel>How are you feeling?</EmojiLabel>
                    <EmojiOptions>
                      {emojiOptions.map((emoji) => (
                        <EmojiOption
                          key={emoji}
                          onClick={() => setFormData({ ...formData, emoji })}
                          selected={formData.emoji === emoji}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {emoji}
                        </EmojiOption>
                      ))}
                    </EmojiOptions>
                  </EmojiSelector>

                  <input type="hidden" name="emoji" value={formData.emoji} />

                  <SubmitButton
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{
                      scale: 1.02,
                      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                        Sending {formData.emoji}
                      </>
                    ) : (
                      `Send Message ${formData.emoji}`
                    )}
                  </SubmitButton>
                </Form>
              )}
            </AnimatePresence>
          </FormContainer>
        </RightSide>
      </ContactContainer>
    </PageContainer>
  );
};

// Styled Components with your color scheme
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  padding: 2rem;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(245, 245, 245, 1) 100%
  );
  z-index: 0;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
      circle,
      rgba(30, 58, 95, 0.05) 0%,
      transparent 70%
    );
    animation: rotate 30s linear infinite;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ContactContainer = styled(motion.div)`
  display: flex;
  width: 100%;
  max-width: 1200px;
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 1;
  opacity: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    border-radius: 16px;
  }
`;

const LeftSide = styled.div`
  flex: 1;
  padding: 3rem;
  background: linear-gradient(135deg, #f5f5f5, #ffffff);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const TitleContainer = styled.div`
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #2c2c2c;
  font-weight: 800;
  background: linear-gradient(90deg, #1e3a5f, #4a5d23);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #2c2c2c;
  line-height: 1.6;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const ContactMethods = styled.div`
  margin-bottom: 2rem;
`;

const ContactMethod = styled(motion.div)`
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  margin-bottom: 1rem;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  @media (max-width: 480px) {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const MethodIcon = styled.div`
  font-size: 1.5rem;
  margin-right: 1.5rem;
  flex-shrink: 0;

  @media (max-width: 480px) {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

const ContactMethodContent = styled.div`
  flex: 1;
  min-width: 0; /* This prevents flex items from overflowing */

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const ContactMethodTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.3rem;
  color: #2c2c2c;
  font-weight: 600;
`;

const ContactMethodText = styled.p`
  font-size: 0.95rem;
  color: #2c2c2c;
  word-break: break-word; /* This ensures long text breaks properly */
  overflow-wrap: break-word; /* Alternative property for better browser support */
  line-height: 1.4;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;

  @media (max-width: 480px) {
    justify-content: center;
  }
`;

const SocialIcon = styled(motion.div)`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  color: #1e3a5f;

  &:hover {
    background: #f5f5f5;
  }

  @media (max-width: 480px) {
    width: 35px;
    height: 35px;
  }

  svg {
    width: 20px;
    height: 20px;

    @media (max-width: 480px) {
      width: 18px;
      height: 18px;
    }
  }
`;

const RightSide = styled.div`
  flex: 1;
  padding: 3rem;
  background: #ffffff;
  position: relative;

  @media (max-width: 768px) {
    padding: 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const FormContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Form = styled(motion.form)`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 2rem;
  position: relative;
`;

const Label = styled.label`
  position: absolute;
  left: 0;
  top: 0;
  color: ${(props) => (props.active ? "#1E3A5F" : "#2C2C2C")};
  font-size: ${(props) =>
    props.active || props.inputValue ? "0.8rem" : "1rem"};
  transform: ${(props) =>
    props.active || props.inputValue
      ? "translateY(-20px)"
      : "translateY(10px)"};
  transition: all 0.3s ease;
  pointer-events: none;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid #f5f5f5;
  font-size: 1rem;
  color: #2c2c2c;
  transition: all 0.3s ease;
  background: transparent;

  &:focus {
    outline: none;
    border-bottom-color: #1e3a5f;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px 0;
  border: none;
  border-bottom: 2px solid #f5f5f5;
  font-size: 1rem;
  color: #2c2c2c;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  background: transparent;

  &:focus {
    outline: none;
    border-bottom-color: #1e3a5f;
  }
`;

const Underline = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: ${(props) => (props.active ? "100%" : "0%")};
  height: 2px;
  background: #1e3a5f;
  transition: width 0.3s ease;
`;

const EmojiSelector = styled.div`
  margin-bottom: 2rem;
`;

const EmojiLabel = styled.p`
  margin-bottom: 1rem;
  color: #2c2c2c;
`;

const EmojiOptions = styled.div`
  display: flex;
  gap: 1rem;
`;

const EmojiOption = styled(motion.div)`
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  background: ${(props) => (props.selected ? "#1E3A5F" : "#F5F5F5")};
  color: ${(props) => (props.selected ? "white" : "#2C2C2C")};
`;

const SubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #1e3a5f, #4a5d23);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 1rem;

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
  }
`;

const Spinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
`;

const SuccessMessage = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  position: relative;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #f5f5f5;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const ErrorMessage = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: #ffffff;
  border-radius: 12x;
  border: 1px solid #f5f5f5;

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const ErrorIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #1e3a5f;

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const ErrorTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2c2c2c;

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: #2c2c2c;
  margin-bottom: 1.5rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const RetryButton = styled(motion.button)`
  padding: 0.8rem 1.5rem;
  background: #1e3a5f;
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 480px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.8rem;
  }
`;

const Confetti = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

const SuccessIcon = styled(motion.div)`
  font-size: 4rem;
  margin-bottom: 1rem;
  color: #4a5d23;

  @media (max-width: 480px) {
    font-size: 3rem;
  }
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c2c2c;

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const SuccessText = styled.p`
  font-size: 1rem;
  color: #2c2c2c;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export default Contact;
