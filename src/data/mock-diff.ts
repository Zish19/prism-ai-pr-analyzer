// ---------------------------------------------------------------------------
// Mock Diff Data — crypto/hpke/hpke_util.c (OpenSSL PR #31336)
// Realistic C code diff for the HPKE utility functions
// ---------------------------------------------------------------------------

export interface DiffLine {
  type: "add" | "remove" | "context";
  lineOld?: number;
  lineNew?: number;
  content: string;
}

export interface DiffHunk {
  header: string;
  lines: DiffLine[];
}

export interface FileDiff {
  path: string;
  language: string;
  hunks: DiffHunk[];
}

export const MOCK_DIFF: FileDiff = {
  path: "crypto/hpke/hpke_util.c",
  language: "c",
  hunks: [
    {
      header: "@@ -0,0 +1,48 @@",
      lines: [
        { type: "add", lineNew: 1, content: "/*" },
        { type: "add", lineNew: 2, content: " * Copyright 2025 The OpenSSL Project Authors. All Rights Reserved." },
        { type: "add", lineNew: 3, content: " *" },
        { type: "add", lineNew: 4, content: " * Licensed under the Apache License 2.0 (the \"License\")." },
        { type: "add", lineNew: 5, content: " * You may not use this file except in compliance with the License." },
        { type: "add", lineNew: 6, content: " */" },
        { type: "add", lineNew: 7, content: "" },
        { type: "add", lineNew: 8, content: "#include <openssl/hpke.h>" },
        { type: "add", lineNew: 9, content: "#include <openssl/err.h>" },
        { type: "add", lineNew: 10, content: "#include \"crypto/hpke.h\"" },
        { type: "add", lineNew: 11, content: "" },
        { type: "add", lineNew: 12, content: "int OSSL_HPKE_get_suite(const char *str, OSSL_HPKE_SUITE *suite)" },
        { type: "add", lineNew: 13, content: "{" },
        { type: "add", lineNew: 14, content: "    if (str == NULL || suite == NULL) {" },
        { type: "add", lineNew: 15, content: "        ERR_raise(ERR_LIB_CRYPTO, ERR_R_PASSED_NULL_PARAMETER);" },
        { type: "add", lineNew: 16, content: "        return 0;" },
        { type: "add", lineNew: 17, content: "    }" },
        { type: "add", lineNew: 18, content: "    return ossl_hpke_str2suite(str, suite);" },
        { type: "add", lineNew: 19, content: "}" },
        { type: "add", lineNew: 20, content: "" },
        { type: "add", lineNew: 21, content: "size_t OSSL_HPKE_get_public_key_size(OSSL_HPKE_SUITE suite)" },
        { type: "add", lineNew: 22, content: "{" },
        { type: "add", lineNew: 23, content: "    const OSSL_HPKE_KEM_INFO *kem_info;" },
        { type: "add", lineNew: 24, content: "" },
        { type: "add", lineNew: 25, content: "    kem_info = ossl_HPKE_KEM_INFO_find(suite.kem_id);" },
        { type: "add", lineNew: 26, content: "    if (kem_info == NULL)" },
        { type: "add", lineNew: 27, content: "        return 0;" },
        { type: "add", lineNew: 28, content: "    return kem_info->Npk;" },
        { type: "add", lineNew: 29, content: "}" },
        { type: "add", lineNew: 30, content: "" },
        { type: "add", lineNew: 31, content: "int OSSL_HPKE_mode_is_supported(OSSL_HPKE_SUITE suite, int mode)" },
        { type: "add", lineNew: 32, content: "{" },
        { type: "add", lineNew: 33, content: "    if (mode < OSSL_HPKE_MODE_BASE" },
        { type: "add", lineNew: 34, content: "            || mode > OSSL_HPKE_MODE_AUTH_PSK)" },
        { type: "add", lineNew: 35, content: "        return 0;" },
        { type: "add", lineNew: 36, content: "    return ossl_hpke_suite_check(suite) == 1;" },
        { type: "add", lineNew: 37, content: "}" },
        { type: "add", lineNew: 38, content: "" },
        { type: "add", lineNew: 39, content: "int OSSL_HPKE_suite2str(OSSL_HPKE_SUITE suite," },
        { type: "add", lineNew: 40, content: "                       char *buf, size_t buf_len)" },
        { type: "add", lineNew: 41, content: "{" },
        { type: "add", lineNew: 42, content: "    if (buf == NULL || buf_len == 0) {" },
        { type: "add", lineNew: 43, content: "        ERR_raise(ERR_LIB_CRYPTO, ERR_R_PASSED_NULL_PARAMETER);" },
        { type: "add", lineNew: 44, content: "        return 0;" },
        { type: "add", lineNew: 45, content: "    }" },
        { type: "add", lineNew: 46, content: "    return ossl_hpke_suite2str(suite, buf, buf_len);" },
        { type: "add", lineNew: 47, content: "}" },
      ],
    },
  ],
};

export const MOCK_HEADER_DIFF: FileDiff = {
  path: "include/openssl/hpke.h",
  language: "c",
  hunks: [
    {
      header: "@@ -85,6 +85,18 @@",
      lines: [
        { type: "context", lineOld: 85, lineNew: 85, content: "int OSSL_HPKE_keygen(OSSL_HPKE_SUITE suite," },
        { type: "context", lineOld: 86, lineNew: 86, content: "                     unsigned char *pub, size_t *publen," },
        { type: "context", lineOld: 87, lineNew: 87, content: "                     EVP_PKEY **priv, OSSL_LIB_CTX *libctx);" },
        { type: "context", lineOld: 88, lineNew: 88, content: "" },
        { type: "add", lineNew: 89, content: "/* HPKE suite introspection utilities */" },
        { type: "add", lineNew: 90, content: "int OSSL_HPKE_get_suite(const char *str, OSSL_HPKE_SUITE *suite);" },
        { type: "add", lineNew: 91, content: "size_t OSSL_HPKE_get_public_key_size(OSSL_HPKE_SUITE suite);" },
        { type: "add", lineNew: 92, content: "int OSSL_HPKE_mode_is_supported(OSSL_HPKE_SUITE suite, int mode);" },
        { type: "add", lineNew: 93, content: "int OSSL_HPKE_suite2str(OSSL_HPKE_SUITE suite," },
        { type: "add", lineNew: 94, content: "                       char *buf, size_t buf_len);" },
        { type: "add", lineNew: 95, content: "" },
        { type: "context", lineOld: 89, lineNew: 96, content: "# ifdef __cplusplus" },
        { type: "context", lineOld: 90, lineNew: 97, content: "}" },
        { type: "context", lineOld: 91, lineNew: 98, content: "# endif" },
      ],
    },
  ],
};
