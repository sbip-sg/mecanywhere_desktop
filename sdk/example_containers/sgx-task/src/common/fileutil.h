#ifndef MECA_SGX_COMMON_U_FILEUTIL_H_
#define MECA_SGX_COMMON_U_FILEUTIL_H_

#include <fstream>

inline bool IsFileExist(const std::string& file_path) {
  std::ifstream infile(file_path);
  return infile.good();
}

int ReadFileToString(const std::string& file_path, std::string* content);

/**
 * @brief read the content of a file into a char array.
 *
 * @param file_path
 * @param output_len output_len will be updated with the len of read content,
 *  if succeeded
 * @return char* : read content (caller owns the data and shall free it).
 */
char* ReadFileToCharArray(const char* file_path, size_t* output_len);

int WriteStringToFile(const std::string& file_path, const std::string& content);

/**
 * @brief write a char array to a file
 *
 * @param file_path
 * @param src
 * @param len : len of the char array
 * @return int : 0 for success; -1 for failure
 */
int WriteCharArrayToFile(const char* file_path, const char* src, size_t len);

#endif  // MECA_SGX_COMMON_U_FILEUTIL_H_
