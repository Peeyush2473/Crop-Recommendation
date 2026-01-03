import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function InputParams({ label, value, onChangeText, placeholder }) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor="#999"
                keyboardType="numeric"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: '48%', // Allows two inputs per row if wrapped
    },
    label: {
        color: '#333',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
        marginLeft: 5,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
});
