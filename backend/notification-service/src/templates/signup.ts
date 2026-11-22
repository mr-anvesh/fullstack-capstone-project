export function signupEmail(name: string) {
  return {
    subject: 'Welcome!',
    text: `Hi ${name}, thanks for signing up.`,
  };
}