import { Body, Column, Container, Head, Heading, Html, Preview, Row, Section, Text } from "react-email";
import { TailwindConfig } from "../components/tailwind-config";

export default function ForgotPassword({ confirmationCode }: { confirmationCode: string }) {
  return (
    <TailwindConfig>
      <Html lang="pt-BR">
        <Head>
          <meta charSet="UTF-8" />
        </Head>
        <Preview>Seu código de recuperação do Foodiary</Preview>

        <Body className="m-0 bg-[#F6F7F1] px-4 py-10 font-sans text-[#17210E]">
          <Container className="mx-auto w-full max-w-[560px] overflow-hidden rounded-[28px] border border-solid border-[#DDE7D0] bg-[#FCFFF6] shadow-[0_24px_80px_rgba(23,33,14,0.12)]">
            <Section className="bg-[#17210E] px-8 pb-9 pt-8">
              <Row>
                <Column>
                  <Text className="m-0 text-[12px] font-bold uppercase tracking-[3px] text-[#A2E635]">
                    Foodiary
                  </Text>
                  <Heading
                    as="h1"
                    className="m-0 mt-6 max-w-[390px] text-[38px] font-semibold leading-[42px] text-[#FCFFF6]"
                    style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    Recupere a sua conta
                  </Heading>
                  <Text className="m-0 mt-4 max-w-[420px] text-[16px] leading-[25px] text-[#C9D7BB]">
                    Use o código abaixo para redefinir sua senha e voltar a acessar seu diário alimentar.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="px-8 py-9">
              <Row>
                <Column>
                  <Text className="m-0 text-[13px] font-bold uppercase tracking-[2.4px] text-[#59624E]">
                    Código de verificação
                  </Text>

                  <Text className="m-0 mt-4 rounded-[18px] border border-solid border-[#8DCC23] bg-[#A2E635] px-7 py-5 text-center text-[34px] font-black leading-none tracking-[12px] text-[#17210E] shadow-[0_12px_32px_rgba(162,230,53,0.34)]">
                    {confirmationCode}
                  </Text>

                  <Text className="m-0 mt-5 text-[15px] leading-[24px] text-[#59624E]">
                    Esse código expira em poucos minutos. Se você não pediu essa troca, ignore este e-mail:
                    sua conta continua protegida.
                  </Text>
                </Column>
              </Row>
            </Section>

            <Section className="border-0 border-t border-solid border-[#E5ECD9] px-8 pb-8 pt-6">
              <Row>
                <Column>
                  <Text className="m-0 text-[12px] leading-[19px] text-[#7B8570]">
                    Esta mensagem foi enviada automaticamente pelo Foodiary. Não responda este e-mail.
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Html>
    </TailwindConfig>
  );
}

ForgotPassword.PreviewProps = {
  confirmationCode: "336318",
};
