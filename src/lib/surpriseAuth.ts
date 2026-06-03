import { timingSafeEqual } from "crypto";

export function getSurprisePassword() {
    return "0929";
}

export function isPasswordValid(candidate: string) {
    const password = getSurprisePassword();

    if (!password) {
        return false;
    }

    const candidateBuffer = Buffer.from(candidate);
    const passwordBuffer = Buffer.from(password);

    if (candidateBuffer.length !== passwordBuffer.length) {
        return false;
    }

    return timingSafeEqual(candidateBuffer, passwordBuffer);
}
