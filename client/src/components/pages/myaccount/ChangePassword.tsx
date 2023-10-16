import React, { useState } from 'react';
import styled from 'styled-components';

import Input from '@components/atomic/Input';

import api_update_user_info from '@utils/api/interact/update_user_info';

const FormField = styled.div`
    margin-bottom: 15px;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 5px;
`;

const Button = styled.button`
    padding: 10px 15px;
    background-color: #0077b6;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    
    &:hover {
        background-color: #005888;
    }
`;

const ErrorMessage = styled.p`
    color: red;
`;

const ChangePassword: React.FC = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setError("New passwords do not match!");
            return;
        }

        if (formData.newPassword.length < 8) {
            setError("New password must be at least 8 characters!");
            return;
        }

        const res = await api_update_user_info({
            password: {
                oldPassword: formData.currentPassword,
                newPassword: formData.newPassword
            }
        });
    };

    return (
        <section>
            <h3>Password</h3>
            <form onSubmit={handleSubmit}>
                <FormField>
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input type="password" id="currentPassword" name="currentPassword" value={formData.currentPassword} onChange={handleChange} />
                </FormField>
                <FormField>
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input type="password" id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleChange} />
                </FormField>
                <FormField>
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                </FormField>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Button type="submit">Submit</Button>
            </form>
        </section>
    );
};

export default ChangePassword;