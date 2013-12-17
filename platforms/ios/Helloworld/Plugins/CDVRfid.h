//
//  CDVRfid.h
//  Qinju
//
//  Created by joe on 12/1/13.
//
//

#import <Cordova/CDV.h>
#import "RcpApi.h"

@interface CDVRfid : CDVPlugin<RcpDelegate>

- (void)echo:(CDVInvokedUrlCommand*) command;

@end
