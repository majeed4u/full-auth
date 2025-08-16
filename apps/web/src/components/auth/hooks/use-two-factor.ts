import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function useTwoFactor() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const enable2FA = async (password: string, issuer?: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: enableError } = await authClient.twoFactor.enable({
                password,
                issuer,
            });

            if (enableError) {
                setError(enableError.message || "Failed to enable 2FA");
                return { data: null, error: enableError };
            }

            return { data, error: null };
        } catch (err) {
            const errorMessage = "An unexpected error occurred";
            setError(errorMessage);
            return { data: null, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const disable2FA = async (password: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: disableError } = await authClient.twoFactor.disable({
                password,
            });

            if (disableError) {
                setError(disableError.message || "Failed to disable 2FA");
                return { data: null, error: disableError };
            }

            return { data, error: null };
        } catch (err) {
            const errorMessage = "An unexpected error occurred";
            setError(errorMessage);
            return { data: null, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const verifyTOTP = async (code: string, trustDevice?: boolean) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: verifyError } = await authClient.twoFactor.verifyTotp({
                code,
                trustDevice,
            });

            if (verifyError) {
                setError(verifyError.message || "Invalid code");
                return { data: null, error: verifyError };
            }

            return { data, error: null };
        } catch (err) {
            const errorMessage = "An unexpected error occurred";
            setError(errorMessage);
            return { data: null, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const sendOTP = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: sendError } = await authClient.twoFactor.sendOtp();

            if (sendError) {
                setError(sendError.message || "Failed to send OTP");
                return { data: null, error: sendError };
            }

            return { data, error: null };
        } catch (err) {
            const errorMessage = "Failed to send OTP";
            setError(errorMessage);
            return { data: null, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async (code: string, trustDevice?: boolean) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: verifyError } = await authClient.twoFactor.verifyOtp({
                code,
                trustDevice,
            });

            if (verifyError) {
                setError(verifyError.message || "Invalid code");
                return { data: null, error: verifyError };
            }

            return { data, error: null };
        } catch (err) {
            const errorMessage = "An unexpected error occurred";
            setError(errorMessage);
            return { data: null, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const verifyBackupCode = async (code: string, trustDevice?: boolean) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: verifyError } = await authClient.twoFactor.verifyBackupCode({
                code,
                trustDevice,
            });

            if (verifyError) {
                setError(verifyError.message || "Invalid backup code");
                return { data: null, error: verifyError };
            }

            return { data, error: null };
        } catch (err) {
            const errorMessage = "An unexpected error occurred";
            setError(errorMessage);
            return { data: null, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const generateBackupCodes = async (password: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: generateError } = await authClient.twoFactor.generateBackupCodes({
                password,
            });

            if (generateError) {
                setError(generateError.message || "Failed to generate backup codes");
                return { data: null, error: generateError };
            }

            return { data, error: null };
        } catch (err) {
            const errorMessage = "Failed to generate backup codes";
            setError(errorMessage);
            return { data: null, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    const getTotpUri = async (password: string) => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: uriError } = await authClient.twoFactor.getTotpUri({
                password,
            });

            if (uriError) {
                setError(uriError.message || "Failed to get TOTP URI");
                return { data: null, error: uriError };
            }

            return { data, error: null };
        } catch (err) {
            const errorMessage = "Failed to get TOTP URI";
            setError(errorMessage);
            return { data: null, error: { message: errorMessage } };
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        enable2FA,
        disable2FA,
        verifyTOTP,
        sendOTP,
        verifyOTP,
        verifyBackupCode,
        generateBackupCodes,
        getTotpUri,
    };
}
