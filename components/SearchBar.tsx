import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Search, SlidersHorizontal, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { colors } from "./ui/themes/colors";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  value?: string;
  onChangeText?: (text: string) => void;
  autoFocus?: boolean;
}

const SearchBar = ({
  onSearch,
  value,
  onChangeText,
  autoFocus = false,
}: SearchBarProps) => {
  const [localValue, setLocalValue] = useState(value || "");
  const router = useRouter();

  // Synchroniser avec props
  useEffect(() => {
    if (value !== undefined) setLocalValue(value);
  }, [value]);

  const handleSubmit = () => {
    if (localValue.trim()) {
      onSearch?.(localValue.trim());
      // Navigation vers la page de résultats si pas de handler externe
      if (!onSearch) {
        router.push({
          pathname: "/connected/screens/search",
          params: { q: localValue.trim() },
        });
      }
    }
  };

  const handleChange = (text: string) => {
    setLocalValue(text);
    onChangeText?.(text);
  };

  const clearSearch = () => {
    setLocalValue("");
    onChangeText?.("");
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      colors={[colors.primary, "#fff"]}
      style={styles.container}
    >
      <View style={styles.inputContainer}>
        <Search color={colors.primary} strokeWidth={2} />
        <TextInput
          style={styles.textInput}
          placeholder="Rechercher des sujets, fichiers..."
          placeholderTextColor="#666"
          value={localValue}
          onChangeText={handleChange}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoFocus={autoFocus}
        />
        {localValue ? (
          <TouchableOpacity onPress={clearSearch}>
            <X color={colors.primary} size={20} />
          </TouchableOpacity>
        ) : (
          <SlidersHorizontal color={colors.primary} strokeWidth={2} />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    marginTop: 5,
    padding: 5,
    borderRadius: 200,
    width: "90%",
  },
  inputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    borderRadius: 25,
    height: 45,
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    fontSize: 16,
    color: "#000",
  },
});

export { SearchBar };

