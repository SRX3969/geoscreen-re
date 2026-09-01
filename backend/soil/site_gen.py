import math
import random
def site_dimensions(area_km2):
    side=math.sqrt(area_km2)
    return side

def boundaries(lat,log,site):
    sidee=site_dimensions(site)
    ns=float(sidee/111)
    ew=sidee/(111*math.cos(math.radians(lat)))
    '''return ns,ew'''
    mn=lat+ns/2
    ms=lat-ns/2
    me=log+ew/2
    mw=log-ew/2
    '''return mn,ms,me,mw'''
    combined=[]
    '''gapf=(me-mw)/4
    gapl=(mn-ms)/4
    gl=[]
    gf=[]
    for i in range(5):
        gl.append(ms+gapl*i)
        gf.append(mw+gapf*i)
    print(gl)
    print(gf)'''
    combined=[]
    '''for i in gl:
        for j in gf:
            combined.append((i,j))
    print(combined)'''
    for i in range(1000):
        combined.append((random.uniform(ms,mn),random.uniform(mw,me)))
    
    return combined
#print(boundaries(20.5,17.0,50))




    



