'use client';

import React from 'react';
import {
    ActionBar,
    ActionBarLeft,
    ActionBarRight,
    Button
} from '../../components/AdminStyles';
import SelectDropDown from '@components/atomic/SelectDropDown';
import SearchBar from '@components/atomic/SearchBar';
import { FilterGroup, FilterLabel, DateTimeInput } from './LogStyles';

const LEVEL_OPTIONS = [
    { value: '', label: 'All Levels' },
    { value: 'debug', label: 'Debug' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'fatal', label: 'Fatal' }
];

const CLEARED_OPTIONS = [
    { value: '', label: 'All Logs' },
    { value: 'false', label: 'Active Only' },
    { value: 'true', label: 'Cleared Only' }
];

interface LogFiltersProps {
    levelFilter: string;
    setLevelFilter: (value: string) => void;
    clearedFilter: string;
    setClearedFilter: (value: string) => void;
    startDate: string;
    setStartDate: (value: string) => void;
    endDate: string;
    setEndDate: (value: string) => void;
    searchInput: string;
    setSearchInput: (value: string) => void;
    onSearch: (e: React.FormEvent) => void;
    onClearFilters: () => void;
    showClearFilters: boolean;
    // Selection actions
    selectedCount: number;
    onClearSelected: () => void;
    onUnclearSelected: () => void;
    onClearAll: () => void;
    clearing: boolean;
    hasLogs: boolean;
    // Download actions
    onDownloadPage: () => void;
    onDownloadAll: () => void;
    downloading: boolean;
}

export function LogFilters({
    levelFilter,
    setLevelFilter,
    clearedFilter,
    setClearedFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    searchInput,
    setSearchInput,
    onSearch,
    onClearFilters,
    showClearFilters,
    selectedCount,
    onClearSelected,
    onUnclearSelected,
    onClearAll,
    clearing,
    hasLogs,
    onDownloadPage,
    onDownloadAll,
    downloading
}: LogFiltersProps) {
    return (
        <ActionBar>
            <ActionBarLeft>
                <SelectDropDown
                    value={levelFilter}
                    onChange={setLevelFilter}
                    options={LEVEL_OPTIONS}
                    styleContainer={{ width: '130px', margin: 0 }}
                />
                <SelectDropDown
                    value={clearedFilter}
                    onChange={setClearedFilter}
                    options={CLEARED_OPTIONS}
                    styleContainer={{ width: '130px', margin: 0 }}
                />
                <FilterGroup>
                    <FilterLabel>From:</FilterLabel>
                    <DateTimeInput
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </FilterGroup>
                <FilterGroup>
                    <FilterLabel>To:</FilterLabel>
                    <DateTimeInput
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </FilterGroup>
                <form onSubmit={onSearch}>
                    <SearchBar
                        placeholder="Search logs..."
                        value={searchInput}
                        onChange={setSearchInput}
                        styleContainer={{
                            width: '200px',
                            margin: 0
                        }}
                    />
                </form>
            </ActionBarLeft>
            <ActionBarRight>
                {showClearFilters && (
                    <Button
                        variant="secondary"
                        size="small"
                        onClick={onClearFilters}
                    >
                        Clear Filters
                    </Button>
                )}
                {selectedCount > 0 && (
                    <>
                        {clearedFilter !== 'true' && (
                            <Button
                                variant="warning"
                                size="small"
                                onClick={onClearSelected}
                                disabled={clearing}
                            >
                                {clearing
                                    ? 'Clearing...'
                                    : `Clear ${selectedCount}`}
                            </Button>
                        )}
                        {clearedFilter === 'true' && (
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={onUnclearSelected}
                                disabled={clearing}
                            >
                                {clearing
                                    ? 'Restoring...'
                                    : `Restore ${selectedCount}`}
                            </Button>
                        )}
                    </>
                )}
                {clearedFilter !== 'true' && hasLogs && (
                    <Button
                        variant="danger"
                        size="small"
                        onClick={onClearAll}
                        disabled={clearing}
                    >
                        Clear All Matching
                    </Button>
                )}
                <Button
                    variant="secondary"
                    size="small"
                    onClick={onDownloadPage}
                    disabled={downloading || !hasLogs}
                >
                    {downloading ? 'Downloading...' : 'Download Page'}
                </Button>
                <Button
                    variant="primary"
                    size="small"
                    onClick={onDownloadAll}
                    disabled={downloading}
                >
                    {downloading ? 'Downloading...' : 'Download All'}
                </Button>
            </ActionBarRight>
        </ActionBar>
    );
}

interface ErrorFiltersProps {
    resolvedFilter: string;
    setResolvedFilter: (value: string) => void;
    onDownload: () => void;
    downloading: boolean;
    hasErrors: boolean;
}

export function ErrorFilters({
    resolvedFilter,
    setResolvedFilter,
    onDownload,
    downloading,
    hasErrors
}: ErrorFiltersProps) {
    return (
        <ActionBar>
            <ActionBarLeft>
                <SelectDropDown
                    value={resolvedFilter}
                    onChange={setResolvedFilter}
                    options={[
                        { value: '', label: 'All Errors' },
                        { value: 'false', label: 'Unresolved' },
                        { value: 'true', label: 'Resolved' }
                    ]}
                    styleContainer={{ width: '180px', margin: 0 }}
                />
            </ActionBarLeft>
            <ActionBarRight>
                <Button
                    variant="primary"
                    size="small"
                    onClick={onDownload}
                    disabled={downloading || !hasErrors}
                >
                    {downloading ? 'Downloading...' : 'Download Errors'}
                </Button>
            </ActionBarRight>
        </ActionBar>
    );
}
