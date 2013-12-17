//
//  RcpApi.h
//  AreteAudio
//
//  Created by phychips on 2013. 3. 18..
//  Copyright (c) 2013 PHYCHIPS. All rights reserved.
//
#import <Foundation/Foundation.h>
#import "AudioMgr.h"

@protocol RcpDelegate;

@interface RcpApi : NSObject <AudioMgrDelegate>

- (id)init;

- (BOOL)open;
- (BOOL)isOpened;
- (void)close;

- (BOOL)startReadTags:(uint8_t)mtnu mtime:(uint8_t)mtime repeatCycle:(uint16_t)repeatCycle;
- (BOOL)stopReadTags;
- (BOOL)getReaderInfo:(uint8_t)infoType;
- (BOOL)getRegion;
- (BOOL)setRegion:(uint8_t)region;
- (BOOL)getSelectParam;
- (BOOL)setSelectParam:(uint8_t)target 
	action:(uint8_t)action 
	memoryBank:(uint8_t)memoryBank 
	pointer:(uint32_t)pointer 
	length:(uint8_t)length 
	truncate:(uint8_t)truncate 
	mask:(NSData *)mask;
- (BOOL)getQueryParam;
- (BOOL)setQueryParam:(uint8_t)dr
	m:(uint8_t)m 
	trext:(uint8_t)trext 
	sel:(uint8_t)sel 
	session:(uint8_t)session 
	target:(uint8_t)target 
	q:(uint8_t)q;
- (BOOL)getChannel;
- (BOOL)setChannel:(uint8_t)channel
     channelOffset:(uint8_t)channelOffset;
- (BOOL)getFhLbtParam;
- (BOOL)setFhLbtParam:(uint16_t)readTime 
		idleTime:(uint16_t)idleTime 
		carrierSenseTime:(uint16_t) carrierSenseTime 
		rfLevel:(uint16_t)rfLevel 
		frequencyHopping:(uint8_t)frequencyHopping 
		listenBeforeTalk:(uint8_t)listenBeforeTalk 
		continuousWave:(uint8_t)continuousWave;
- (BOOL)getOutputPowerLevel;
- (BOOL)setOutputPowerLevel:(uint16_t)power;
- (BOOL)setRfCw:(uint8_t)on;
- (BOOL)readFromTagMemory:(uint32_t)accessPassword
		epc:(NSData*)epc
		memoryBank:(uint8_t)memoryBank
		startAddress:(uint16_t)startAddress
		dataLength:(uint16_t)dataLength;
- (BOOL)getFreqHoppingTable;
- (BOOL)setFreqHoppingTable:(uint8_t)tableSize
		channels:(NSData*)channels;
- (BOOL)getModulation;
- (BOOL)setModulation:(uint8_t)mode;
- (BOOL)getAnticollision;
- (BOOL)setAnticollision:(uint8_t)mode;
- (BOOL)writeToTagMemory:(uint32_t)accessPassword
		epc:(NSData*)epc
		memoryBank:(uint8_t)memoryBank
		startAddress:(uint16_t)startAddress
		dataToWrite:(NSData*)dataToWrite;
- (BOOL)killTag:(uint32_t)killPassword
		epc:(NSData*)epc;
- (BOOL)lockTagMemory:(uint32_t)accessPassword
		epc:(NSData*)epc
		lockData:(uint32_t)lockData;
- (BOOL)getTemperature;
- (BOOL)getRssi;
- (BOOL)updateRegistry:(uint8_t)update;
- (BOOL)eraseRegistry:(uint8_t)erase;
- (BOOL)getRegistryItem:(uint16_t)registryItem;
- (BOOL)setBeep:(uint8_t)on;

@property (nonatomic, assign) BOOL isConnected;
@property (nonatomic, weak) id<RcpDelegate> delegate;
@end

@protocol RcpDelegate <NSObject>
@optional
- (void)plugged:(BOOL)plug;
- (void)pcEpcReceived:(NSData *)pcEpc;
- (void)readerConnected;
- (void)ackReceived:(uint8_t)commandCode;
- (void)errReceived:(uint8_t)errCode;
- (void)readerInfoReceived:(NSData *)data;
- (void)regionReceived:(uint8_t)region;
- (void)selectParamReceived:(NSData *)selParam;
- (void)queryParamReceived:(NSData *)qryParam;
- (void)channelReceived:(uint8_t)channel channelOffset:(uint8_t)channelOffset;
- (void)fhLbtReceived:(NSData *)fhLb;
- (void)txPowerLevelReceived:(uint8_t)power;
- (void)tagMemoryReceived:(NSData *)data;
- (void)hoppingTableReceived:(NSData *)table;
- (void)modulationParamReceived:(uint8_t)param;
- (void)anticolParamReceived:(uint8_t)param;
- (void)tempReceived:(uint8_t)temp;
- (void)rssiReceived:(uint16_t)rssi;
- (void)registeryItemReceived:(NSData *)item;
- (void)adcReceived:(NSData*)data;
@end

