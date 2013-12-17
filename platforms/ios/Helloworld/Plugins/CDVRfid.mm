//
//  CDVRfid.m
//  Qinju
//
//  Created by joe on 12/1/13.
//
//

#import "CDVRfid.h"
#import <Cordova/CDV.h>
#import "AudioMgr.h"
#import "RcpApi.h"

@interface CDVRfid()

- (void)pcEpcReceived:(NSData *)pcEpc;

- (void)pluginInitialize;

- (void)dispose;

- (void)ackReceived:(uint8_t)commandCode;

- (void)errReceived:(uint8_t)errCode;

@property (nonatomic,strong,readwrite) RcpApi *rcp;

@property (nonatomic,strong,readwrite) NSString *msg;

@property BOOL hasRead;

@property CDVPluginResult* pluginResult;

@end


@implementation CDVRfid

@synthesize rcp=_rcp;

- (void)echo:(CDVInvokedUrlCommand *)command{
    
    [self.commandDelegate runInBackground:^{
        self.pluginResult = nil;
        self.hasRead = false;
        self.msg = @"";
        int stopTagCount = [[NSUserDefaults standardUserDefaults] integerForKey:@"stopTagCount"];
        int stopTime = [[NSUserDefaults standardUserDefaults] integerForKey:@"stopTime"];
        int stopCycle =1;// [[NSUserDefaults standardUserDefaults] integerForKey:@"stopCycle"];
        NSLog(@"stopTagCount %d,stopTime %d,stopCycle %d",stopTagCount,stopTime,stopCycle);
        [self.rcp startReadTags:stopTagCount mtime:stopTime repeatCycle:stopCycle];
        [NSThread sleepForTimeInterval:1.0f];
        if(self.rcp.isConnected){
            self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:self.msg];
        }else{
            self.pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
        }
        [self.commandDelegate sendPluginResult:self.pluginResult callbackId:command.callbackId];
    }];
}

- (RcpApi *)rcp{
    if(!_rcp){
        _rcp=[[RcpApi alloc] init];
        _rcp.delegate = self;
    }
    
    return _rcp;
}

- (void)pluginInitialize{
       if(![self.rcp isOpened]){
        [self.rcp open];
    }
    
    [super pluginInitialize];
}

- (void)dispose{
    
    if([self.rcp isOpened]){
        [self.rcp close];
    }
    [super dispose];
}

- (void)pcEpcReceived:(NSData *)pcEpc{
    
    self.msg = [NSString stringWithFormat:@"%@",pcEpc];
    [self.rcp stopReadTags];
    self.hasRead = true;
}

- (void)ackReceived:(uint8_t)commandCode
{
	//NSLog(@"ack_received [%02X]\n",commandCode);
}

- (void)errReceived:(uint8_t)errCode
{
	//NSLog(@"err_received [%02X]\n",errCode);
}
@end
