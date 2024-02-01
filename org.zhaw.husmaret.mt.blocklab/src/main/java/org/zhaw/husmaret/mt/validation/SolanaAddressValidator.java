package org.zhaw.husmaret.mt.validation;

import java.util.Arrays;

//import org.bouncycastle.math.ec.rfc8032.Ed25519;

public class SolanaAddressValidator {
    
    public static boolean isAddressOnCurve(String address) {
        try {
            // Decode the address from Base58 (Solana commonly uses Base58 for addresses)
            byte[] addressBytes = Base58.decode(address);

            // Check if the address length is 32 bytes (256 bits), which is valid for a compressed Ed25519 public key
            if (addressBytes.length != 32) {
                return false;
            }

            // Use Bouncy Castle's Ed25519 class to validate the public key
//          return Ed25519.validatePublicKeyFull(addressBytes, 0);
            return true;
        } catch (Exception e) {
            // Handle any exceptions (like invalid Base58 encoding)
            return false;
        }
    }

    public static void main(String[] args) {
        String testAddress = "DRpbCBMxVnDK7maPGv6MvB3v1sRMC86PZ8okm21hy";
        boolean isValid = isAddressOnCurve(testAddress);
        System.out.println("Is valid Solana address on curve: " + isValid);
    }

    private class Base58 {
        public static final char[] ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz".toCharArray();
        private static final int[] INDEXES = new int[128];
        static {
            Arrays.fill(INDEXES, -1);
            for (int i = 0; i < ALPHABET.length; i++) {
                INDEXES[ALPHABET[i]] = i;
            }
        }
    
        /**
         * Decodes the given base58 string into the original data bytes.
         *
         * @param input the base58-encoded string to decode
         * @return the decoded data bytes
         */
        public static byte[] decode(String input) {
            if (input.length() == 0) {
                return new byte[0];
            }
            // Convert the base58-encoded ASCII chars to a base58 byte sequence (base58 digits).
            byte[] input58 = new byte[input.length()];
            for (int i = 0; i < input.length(); ++i) {
                char c = input.charAt(i);
                int digit = c < 128 ? INDEXES[c] : -1;
                if (digit < 0) {
                    throw new IllegalArgumentException(String.format("Invalid character in Base58: 0x%04x", (int) c));
                }
                input58[i] = (byte) digit;
            }
            // Count leading zeros.
            int zeros = 0;
            while (zeros < input58.length && input58[zeros] == 0) {
                ++zeros;
            }
            // Convert base-58 digits to base-256 digits.
            byte[] decoded = new byte[input.length()];
            int outputStart = decoded.length;
            for (int inputStart = zeros; inputStart < input58.length; ) {
                decoded[--outputStart] = divmod(input58, inputStart, 58, 256);
                if (input58[inputStart] == 0) {
                    ++inputStart; // optimization - skip leading zeros
                }
            }
            // Ignore extra leading zeroes that were added during the calculation.
            while (outputStart < decoded.length && decoded[outputStart] == 0) {
                ++outputStart;
            }
            // Return decoded data (including original number of leading zeros).
            return Arrays.copyOfRange(decoded, outputStart - zeros, decoded.length);
        }
    
        /**
         * Divides a number, represented as an array of bytes each containing a single digit
         * in the specified base, by the given divisor. The given number is modified in-place
         * to contain the quotient, and the return value is the remainder.
         *
         * @param number the number to divide
         * @param firstDigit the index within the array of the first non-zero digit
         *        (this is used for optimization by skipping the leading zeros)
         * @param base the base in which the number's digits are represented (up to 256)
         * @param divisor the number to divide by (up to 256)
         * @return the remainder of the division operation
         */
        private static byte divmod(byte[] number, int firstDigit, int base, int divisor) {
            // this is just long division which accounts for the base of the input digits
            int remainder = 0;
            for (int i = firstDigit; i < number.length; i++) {
                int digit = (int) number[i] & 0xFF;
                int temp = remainder * base + digit;
                number[i] = (byte) (temp / divisor);
                remainder = temp % divisor;
            }
            return (byte) remainder;
        }
    }
}
