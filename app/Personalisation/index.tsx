import { colors } from '@/components/ui/themes/colors'
import { useRouter } from 'expo-router'
import { ArrowLeft } from 'lucide-react-native'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Personalisation() {
  const router = useRouter()
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backBoutton}>
              <TouchableOpacity onPress={() => router.replace("/auth/connexion")}>
                <ArrowLeft color="#fff" size={25} />
              </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.background,
    padding: 10
  },
  backBoutton: {
    width: "100%",
  },
})